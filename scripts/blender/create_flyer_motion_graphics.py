import math
import os
import random
import sys

import bpy
from mathutils import Vector


PROJECT_ROOT = r"E:\REMBERT REPUESTOS WEB\rembert-repuestos-web"
LOCKUP_PATH = os.path.join(
    PROJECT_ROOT,
    "public",
    "brand",
    "rembert-lockup-vivid-yellow.png",
)
SHOCK_PATH = os.path.join(PROJECT_ROOT, "public", "gabriel-amortiguador-02.png")
ARM_PATH = os.path.join(PROJECT_ROOT, "public", "gabriel-suspension-01.png")
MOUNT_PATH = os.path.join(
    PROJECT_ROOT,
    "public",
    "catalogo-frenos-suspension",
    "vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-catalogo-blanco.webp",
)
BALL_JOINT_PATH = os.path.join(
    PROJECT_ROOT,
    "public",
    "catalogo-tnk",
    "tnk-va7021-rotula-superior-volkswagen-amarok.webp",
)
OUTPUT_DIR = r"E:\REMBERT REPUESTOS WEB\VIDEOS"
BLEND_PATH = os.path.join(OUTPUT_DIR, "rembert-motion-graphics-negro-jerarquia-v6.blend")
PREVIEW_PATH = os.path.join(OUTPUT_DIR, "rembert-motion-graphics-negro-jerarquia-v6-preview.png")
VIDEO_PATH = os.path.join(OUTPUT_DIR, "rembert-motion-graphics-negro-jerarquia-v6.mp4")

WHITE = (1.0, 0.97, 0.90)
# Amarillo REMBERT oficial vivo: sRGB #FFFF00 / RGB 255, 255, 0.
GOLD = (1.0, 1.0, 0.0)
HOT_GOLD = GOLD
BLACK = (0.0, 0.0, 0.0)


def smooth_animation(target):
    if not target.animation_data or not target.animation_data.action:
        return
    for fcurve in target.animation_data.action.fcurves:
        for point in fcurve.keyframe_points:
            point.interpolation = "BEZIER"
            point.handle_left_type = "AUTO_CLAMPED"
            point.handle_right_type = "AUTO_CLAMPED"


def emission_material(name, color, strength=2.0):
    material = bpy.data.materials.new(name=name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    emission = nodes.new("ShaderNodeEmission")
    emission.inputs["Color"].default_value = (*color, 1.0)
    emission.inputs["Strength"].default_value = strength
    material.node_tree.links.new(emission.outputs["Emission"], output.inputs["Surface"])
    return material


def image_material(name, image_path, use_alpha=False, key_white=False, tint_color=None, strength=1.0):
    material = bpy.data.materials.new(name=name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    image = nodes.new("ShaderNodeTexImage")
    image.image = bpy.data.images.load(image_path, check_existing=True)
    image.interpolation = "Linear"
    emission = nodes.new("ShaderNodeEmission")
    emission.inputs["Strength"].default_value = strength
    if tint_color is None:
        material.node_tree.links.new(image.outputs["Color"], emission.inputs["Color"])
    else:
        emission.inputs["Color"].default_value = (*tint_color, 1.0)

    if use_alpha or key_white:
        transparent = nodes.new("ShaderNodeBsdfTransparent")
        mix = nodes.new("ShaderNodeMixShader")
        if use_alpha:
            material.node_tree.links.new(image.outputs["Alpha"], mix.inputs["Fac"])
        else:
            grayscale = nodes.new("ShaderNodeRGBToBW")
            map_range = nodes.new("ShaderNodeMapRange")
            map_range.clamp = True
            map_range.inputs["From Min"].default_value = 0.82
            map_range.inputs["From Max"].default_value = 0.985
            map_range.inputs["To Min"].default_value = 1.0
            map_range.inputs["To Max"].default_value = 0.0
            material.node_tree.links.new(image.outputs["Color"], grayscale.inputs["Color"])
            material.node_tree.links.new(grayscale.outputs["Val"], map_range.inputs["Value"])
            material.node_tree.links.new(map_range.outputs["Result"], mix.inputs["Fac"])
        material.node_tree.links.new(transparent.outputs["BSDF"], mix.inputs[1])
        material.node_tree.links.new(emission.outputs["Emission"], mix.inputs[2])
        material.node_tree.links.new(mix.outputs["Shader"], output.inputs["Surface"])
        if hasattr(material, "surface_render_method"):
            material.surface_render_method = "DITHERED"
    else:
        material.node_tree.links.new(emission.outputs["Emission"], output.inputs["Surface"])
    return material


def create_plane(name, location, scale, material):
    bpy.ops.mesh.primitive_plane_add(size=2, location=location)
    plane = bpy.context.object
    plane.name = name
    plane.scale = scale
    plane.data.materials.append(material)
    return plane


def create_background():
    material = bpy.data.materials.new(name="Procedural_Background")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    emission = nodes.new("ShaderNodeEmission")
    emission.inputs["Strength"].default_value = 0.72
    texcoord = nodes.new("ShaderNodeTexCoord")
    noise = nodes.new("ShaderNodeTexNoise")
    noise.noise_dimensions = "3D"
    noise.inputs["Scale"].default_value = 2.3
    noise.inputs["Detail"].default_value = 6.0
    noise.inputs["Roughness"].default_value = 0.72
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.25
    ramp.color_ramp.elements[0].color = (0.0, 0.0, 0.0, 1.0)
    ramp.color_ramp.elements[1].position = 0.78
    ramp.color_ramp.elements[1].color = (0.0, 0.0, 0.0, 1.0)
    middle = ramp.color_ramp.elements.new(0.56)
    middle.color = (0.0, 0.0, 0.0, 1.0)
    material.node_tree.links.new(texcoord.outputs["Generated"], noise.inputs["Vector"])
    material.node_tree.links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    material.node_tree.links.new(ramp.outputs["Color"], emission.inputs["Color"])
    material.node_tree.links.new(emission.outputs["Emission"], output.inputs["Surface"])
    background = create_plane(
        "REMBERT_Background",
        (0.0, 0.0, 0.0),
        (4.25, 5.35, 1.0),
        material,
    )
    background.rotation_euler[2] = math.radians(-0.35)
    background.keyframe_insert(data_path="rotation_euler", frame=1)
    background.rotation_euler[2] = math.radians(0.18)
    background.keyframe_insert(data_path="rotation_euler", frame=240)
    smooth_animation(background)
    return background


def create_logo():
    material = image_material(
        "REMBERT_Full_Lockup_OriginalColors",
        LOCKUP_PATH,
        use_alpha=True,
        strength=1.08,
    )
    logo = create_plane("REMBERT_Full_Brand_Lockup", (-0.25, 3.62, 0.41), (3.35, 1.16, 1.0), material)
    logo.location.x = -5.25
    logo.rotation_euler[2] = math.radians(-4.5)
    logo.scale = (2.05, 0.71, 1.0)
    logo.keyframe_insert(data_path="location", frame=1)
    logo.keyframe_insert(data_path="rotation_euler", frame=1)
    logo.keyframe_insert(data_path="scale", frame=1)
    logo.location.x = -0.08
    logo.rotation_euler[2] = math.radians(1.2)
    logo.scale = (3.46, 1.20, 1.0)
    logo.keyframe_insert(data_path="location", frame=24)
    logo.keyframe_insert(data_path="rotation_euler", frame=24)
    logo.keyframe_insert(data_path="scale", frame=24)
    logo.location.x = -0.25
    logo.rotation_euler[2] = 0.0
    logo.scale = (3.35, 1.16, 1.0)
    logo.keyframe_insert(data_path="location", frame=34)
    logo.keyframe_insert(data_path="rotation_euler", frame=34)
    logo.keyframe_insert(data_path="scale", frame=34)
    logo.scale = (3.39, 1.175, 1.0)
    logo.keyframe_insert(data_path="scale", frame=152)
    logo.scale = (3.35, 1.16, 1.0)
    logo.keyframe_insert(data_path="scale", frame=240)
    smooth_animation(logo)
    return logo


def animate_product(
    product,
    final_location,
    final_scale,
    start_frame,
    arrival_frame,
    start_location,
    start_rotation,
    final_rotation,
    sway=2.0,
):
    product.location = start_location
    product.scale = tuple(value * 0.42 for value in final_scale)
    product.rotation_euler[2] = math.radians(start_rotation)
    product.keyframe_insert(data_path="location", frame=start_frame)
    product.keyframe_insert(data_path="scale", frame=start_frame)
    product.keyframe_insert(data_path="rotation_euler", frame=start_frame)

    product.location = (
        final_location[0] * 0.96,
        final_location[1] + 0.10,
        final_location[2],
    )
    product.scale = tuple(value * 1.07 for value in final_scale)
    product.rotation_euler[2] = math.radians(final_rotation - 2.0)
    product.keyframe_insert(data_path="location", frame=arrival_frame)
    product.keyframe_insert(data_path="scale", frame=arrival_frame)
    product.keyframe_insert(data_path="rotation_euler", frame=arrival_frame)

    product.location = final_location
    product.scale = final_scale
    product.rotation_euler[2] = math.radians(final_rotation)
    product.keyframe_insert(data_path="location", frame=arrival_frame + 10)
    product.keyframe_insert(data_path="scale", frame=arrival_frame + 10)
    product.keyframe_insert(data_path="rotation_euler", frame=arrival_frame + 10)

    product.location = (final_location[0] + 0.05, final_location[1] + 0.08, final_location[2])
    product.rotation_euler[2] = math.radians(final_rotation + sway)
    product.keyframe_insert(data_path="location", frame=175)
    product.keyframe_insert(data_path="rotation_euler", frame=175)

    product.location = (final_location[0] - 0.03, final_location[1] - 0.05, final_location[2])
    product.rotation_euler[2] = math.radians(final_rotation - sway * 0.65)
    product.keyframe_insert(data_path="location", frame=240)
    product.keyframe_insert(data_path="rotation_euler", frame=240)
    smooth_animation(product)


def create_products():
    shock_material = image_material("Product_Shock", SHOCK_PATH, use_alpha=True, strength=1.15)
    arm_material = image_material("Product_Arm", ARM_PATH, use_alpha=True, strength=1.15)
    mount_material = image_material("Product_Mount", MOUNT_PATH, key_white=True, strength=1.12)
    joint_material = image_material("Product_BallJoint", BALL_JOINT_PATH, key_white=True, strength=1.12)

    shock = create_plane("Product_Amortiguador", (2.63, 0.88, 0.18), (2.18, 2.18, 1.0), shock_material)
    animate_product(
        shock,
        (2.63, 0.88, 0.18),
        (2.18, 2.18, 1.0),
        18,
        50,
        (5.3, 2.9, 0.18),
        18,
        -3,
        sway=1.3,
    )

    mount = create_plane("Product_Base_VAZLO", (2.42, -1.28, 0.21), (1.22, 1.22, 1.0), mount_material)
    animate_product(
        mount,
        (2.42, -1.28, 0.21),
        (1.22, 1.22, 1.0),
        36,
        72,
        (5.2, -0.55, 0.21),
        75,
        3,
        sway=4.0,
    )

    joint = create_plane("Product_Rotula_TNK", (0.82, -2.48, 0.23), (0.94, 0.94, 1.0), joint_material)
    animate_product(
        joint,
        (0.82, -2.48, 0.23),
        (0.94, 0.94, 1.0),
        58,
        92,
        (0.25, -5.5, 0.23),
        -48,
        -7,
        sway=3.2,
    )

    arm = create_plane("Product_Brazo_Suspension", (2.28, -2.92, 0.24), (1.78, 1.55, 1.0), arm_material)
    animate_product(
        arm,
        (2.28, -2.92, 0.24),
        (1.78, 1.55, 1.0),
        74,
        110,
        (5.5, -4.6, 0.24),
        -96,
        -62,
        sway=2.2,
    )


def load_font(candidates):
    for candidate in candidates:
        if os.path.exists(candidate):
            return bpy.data.fonts.load(candidate, check_existing=True)
    return bpy.data.fonts.get("Bfont")


def create_text(name, body, location, size, material, font, align="LEFT", spacing=1.0):
    curve = bpy.data.curves.new(name=f"{name}_Curve", type="FONT")
    curve.body = body
    curve.align_x = align
    curve.align_y = "CENTER"
    curve.size = size
    curve.space_character = spacing
    curve.extrude = 0.003
    curve.bevel_depth = 0.0015
    curve.bevel_resolution = 2
    curve.font = font
    text = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(text)
    text.location = location
    text.data.materials.append(material)
    return text


def animate_slide(text, final_location, start, arrival, from_offset=(-4.0, 0.0), overshoot=0.12):
    text.location = (
        final_location[0] + from_offset[0],
        final_location[1] + from_offset[1],
        final_location[2],
    )
    text.scale = (0.78, 0.78, 0.78)
    text.keyframe_insert(data_path="location", frame=start)
    text.keyframe_insert(data_path="scale", frame=start)
    text.location = (final_location[0] + overshoot, final_location[1], final_location[2])
    text.scale = (1.035, 1.035, 1.035)
    text.keyframe_insert(data_path="location", frame=arrival)
    text.keyframe_insert(data_path="scale", frame=arrival)
    text.location = final_location
    text.scale = (1.0, 1.0, 1.0)
    text.keyframe_insert(data_path="location", frame=arrival + 8)
    text.keyframe_insert(data_path="scale", frame=arrival + 8)
    smooth_animation(text)


def create_bar(name, start, end, z, material, start_frame, end_frame, depth=0.024):
    curve_data = bpy.data.curves.new(name=f"{name}_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = depth
    curve_data.bevel_resolution = 4
    spline = curve_data.splines.new("POLY")
    spline.points.add(1)
    spline.points[0].co = (start[0], start[1], 0.0, 1.0)
    spline.points[1].co = (end[0], end[1], 0.0, 1.0)
    bar = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(bar)
    bar.location.z = z
    curve_data.materials.append(material)
    curve_data.bevel_factor_end = 0.0
    curve_data.keyframe_insert(data_path="bevel_factor_end", frame=start_frame)
    curve_data.bevel_factor_end = 1.0
    curve_data.keyframe_insert(data_path="bevel_factor_end", frame=end_frame)
    smooth_animation(curve_data)
    return bar


def create_rounded_outline(name, center, width, height, radius, z, material, start_frame, end_frame):
    curve_data = bpy.data.curves.new(name=f"{name}_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = 0.018
    curve_data.bevel_resolution = 5
    spline = curve_data.splines.new("POLY")
    points = []
    segments = 7
    corners = [
        (center[0] + width / 2 - radius, center[1] + height / 2 - radius, 0.0, math.pi / 2),
        (center[0] - width / 2 + radius, center[1] + height / 2 - radius, math.pi / 2, math.pi),
        (center[0] - width / 2 + radius, center[1] - height / 2 + radius, math.pi, 3 * math.pi / 2),
        (center[0] + width / 2 - radius, center[1] - height / 2 + radius, 3 * math.pi / 2, 2 * math.pi),
    ]
    for corner_x, corner_y, start_angle, end_angle in corners:
        for index in range(segments + 1):
            angle = start_angle + (end_angle - start_angle) * index / segments
            points.append((corner_x + radius * math.cos(angle), corner_y + radius * math.sin(angle), 0.0, 1.0))
    points.append(points[0])
    spline.points.add(len(points) - 1)
    for index, point in enumerate(points):
        spline.points[index].co = point
    outline = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(outline)
    outline.location.z = z
    curve_data.materials.append(material)
    curve_data.bevel_factor_end = 0.0
    curve_data.keyframe_insert(data_path="bevel_factor_end", frame=start_frame)
    curve_data.bevel_factor_end = 1.0
    curve_data.keyframe_insert(data_path="bevel_factor_end", frame=end_frame)
    smooth_animation(curve_data)
    return outline


def create_star(name, center, outer_radius, inner_radius, z, material):
    vertices = []
    for index in range(10):
        radius = outer_radius if index % 2 == 0 else inner_radius
        angle = math.radians(90 + index * 36)
        vertices.append((center[0] + math.cos(angle) * radius, center[1] + math.sin(angle) * radius, z))
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    mesh.from_pydata(vertices, [], [list(range(10))])
    mesh.update()
    star = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(star)
    star.data.materials.append(material)
    star.scale = (0.0, 0.0, 0.0)
    star.rotation_euler[2] = math.radians(-120)
    star.keyframe_insert(data_path="scale", frame=29)
    star.keyframe_insert(data_path="rotation_euler", frame=29)
    star.scale = (1.22, 1.22, 1.22)
    star.rotation_euler[2] = math.radians(12)
    star.keyframe_insert(data_path="scale", frame=48)
    star.keyframe_insert(data_path="rotation_euler", frame=48)
    star.scale = (1.0, 1.0, 1.0)
    star.rotation_euler[2] = 0.0
    star.keyframe_insert(data_path="scale", frame=58)
    star.keyframe_insert(data_path="rotation_euler", frame=58)
    star.scale = (1.14, 1.14, 1.14)
    star.keyframe_insert(data_path="scale", frame=152)
    star.scale = (1.0, 1.0, 1.0)
    star.keyframe_insert(data_path="scale", frame=170)
    smooth_animation(star)
    return star


def create_energy_streak(name, points, material, start_frame, end_frame, depth=0.018):
    curve_data = bpy.data.curves.new(name=f"{name}_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 10
    curve_data.bevel_depth = depth
    curve_data.bevel_resolution = 4
    spline = curve_data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for index, point in enumerate(points):
        bezier = spline.bezier_points[index]
        bezier.co = point
        bezier.handle_left_type = "AUTO"
        bezier.handle_right_type = "AUTO"
    streak = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(streak)
    curve_data.materials.append(material)
    curve_data.bevel_factor_end = 0.0
    curve_data.keyframe_insert(data_path="bevel_factor_end", frame=start_frame)
    curve_data.bevel_factor_end = 1.0
    curve_data.keyframe_insert(data_path="bevel_factor_end", frame=end_frame)
    curve_data.bevel_factor_start = 0.0
    curve_data.keyframe_insert(data_path="bevel_factor_start", frame=end_frame - 4)
    curve_data.bevel_factor_start = 0.78
    curve_data.keyframe_insert(data_path="bevel_factor_start", frame=end_frame + 68)
    smooth_animation(curve_data)
    return streak


def create_motion_typography():
    impact = load_font([r"C:\Windows\Fonts\impact.ttf"])
    bold = load_font([r"C:\Windows\Fonts\arialbd.ttf", r"C:\Windows\Fonts\Arial.ttf"])
    regular = load_font([r"C:\Windows\Fonts\arial.ttf"])
    white = emission_material("Text_White", WHITE, strength=1.2)
    gold = emission_material("Text_Gold", GOLD, strength=1.0)
    hot_gold = emission_material("Text_HotGold", HOT_GOLD, strength=1.0)

    create_bar("Brand_Top_Line", (-4.1, 4.86), (4.1, 4.86), 0.43, hot_gold, 1, 26, depth=0.030)
    create_logo()
    pill_center = (0.0, 1.86)
    create_rounded_outline(
        "Experience_Pill_Outline",
        pill_center,
        7.55,
        0.98,
        0.42,
        0.43,
        hot_gold,
        24,
        63,
    )
    create_star("Experience_Star", (-3.27, 1.86), 0.31, 0.145, 0.45, hot_gold)

    years = create_text("Text_38_ANOS", "38  AÑOS", (-2.78, 1.86, 0.45), 0.52, gold, impact, spacing=0.98)
    animate_slide(years, (-2.78, 1.86, 0.45), 34, 57, from_offset=(-1.1, 0.0), overshoot=0.07)

    experience = create_text(
        "Text_DE_EXPERIENCIA",
        "DE EXPERIENCIA",
        (-0.63, 1.86, 0.45),
        0.39,
        white,
        bold,
        spacing=0.96,
    )
    animate_slide(experience, (-0.63, 1.86, 0.45), 43, 68, from_offset=(0.0, -0.42), overshoot=0.0)

    footer_material = emission_material("Footer_Black", BLACK, strength=0.15)
    footer = create_plane("Footer_Panel", (0.0, -5.25, 0.27), (4.3, 0.88, 1.0), footer_material)
    footer.keyframe_insert(data_path="location", frame=88)
    footer.location.y = -4.24
    footer.keyframe_insert(data_path="location", frame=112)
    smooth_animation(footer)
    create_bar("Footer_Gold_Line", (-4.0, -3.48), (4.0, -3.48), 0.38, hot_gold, 102, 132, depth=0.030)

    coming = create_text(
        "Text_PROXIMAMENTE",
        "PRÓXIMAMENTE",
        (0.0, -3.84, 0.39),
        0.34,
        gold,
        impact,
        align="CENTER",
        spacing=0.98,
    )
    animate_slide(coming, (0.0, -3.84, 0.39), 103, 128, from_offset=(0.0, -1.2), overshoot=0.0)

    online = create_text(
        "Text_TIENDA_ONLINE",
        "TIENDA ONLINE",
        (0.0, -4.34, 0.39),
        0.62,
        white,
        impact,
        align="CENTER",
        spacing=0.95,
    )
    animate_slide(online, (0.0, -4.34, 0.39), 110, 136, from_offset=(0.0, -1.0), overshoot=0.0)

    url = create_text(
        "Text_URL",
        "www.rembertrepuestos.com",
        (0.0, -4.82, 0.39),
        0.24,
        gold,
        bold,
        align="CENTER",
    )
    animate_slide(url, (0.0, -4.82, 0.39), 121, 148, from_offset=(0.0, -0.7), overshoot=0.0)

    return hot_gold


def create_sparks(material):
    random.seed(138)
    for index in range(18):
        bpy.ops.mesh.primitive_ico_sphere_add(
            subdivisions=1,
            radius=random.uniform(0.012, 0.032),
            location=(random.uniform(-4.0, 4.0), random.uniform(-4.0, 3.5), random.uniform(0.2, 0.42)),
        )
        spark = bpy.context.object
        spark.name = f"MotionSpark_{index:02d}"
        spark.data.materials.append(material)
        start = 32 + index * 7
        base = spark.location.copy()
        spark.scale = (0.0, 0.0, 0.0)
        spark.keyframe_insert(data_path="scale", frame=start)
        spark.scale = (1.0, 1.0, 1.0)
        spark.location = base + Vector((0.0, 0.25, 0.0))
        spark.keyframe_insert(data_path="scale", frame=start + 7)
        spark.keyframe_insert(data_path="location", frame=start + 7)
        spark.scale = (0.0, 0.0, 0.0)
        spark.location = base + Vector((random.uniform(-0.35, 0.35), random.uniform(0.9, 1.5), 0.0))
        spark.keyframe_insert(data_path="scale", frame=start + 48)
        spark.keyframe_insert(data_path="location", frame=start + 48)
        smooth_animation(spark)


def create_camera():
    bpy.ops.object.camera_add(location=(0.0, 0.0, 10.0))
    camera = bpy.context.object
    camera.name = "MotionGraphics_Camera"
    camera.data.type = "ORTHO"
    bpy.context.scene.camera = camera

    camera.location = (-0.12, 0.10, 10.0)
    camera.data.ortho_scale = 10.72
    camera.keyframe_insert(data_path="location", frame=1)
    camera.data.keyframe_insert(data_path="ortho_scale", frame=1)
    camera.location = (0.0, 0.0, 10.0)
    camera.data.ortho_scale = 10.03
    camera.keyframe_insert(data_path="location", frame=55)
    camera.data.keyframe_insert(data_path="ortho_scale", frame=55)
    camera.location = (0.04, -0.04, 10.0)
    camera.data.ortho_scale = 9.94
    camera.keyframe_insert(data_path="location", frame=170)
    camera.data.keyframe_insert(data_path="ortho_scale", frame=170)
    camera.location = (-0.02, -0.08, 10.0)
    camera.data.ortho_scale = 9.90
    camera.keyframe_insert(data_path="location", frame=240)
    camera.data.keyframe_insert(data_path="ortho_scale", frame=240)
    smooth_animation(camera)
    smooth_animation(camera.data)


def configure_compositor():
    scene = bpy.context.scene
    scene.use_nodes = True
    tree = scene.node_tree
    tree.nodes.clear()
    layers = tree.nodes.new("CompositorNodeRLayers")
    glare = tree.nodes.new("CompositorNodeGlare")
    glare.glare_type = "FOG_GLOW"
    glare.quality = "HIGH"
    glare.threshold = 0.80
    glare.size = 5
    composite = tree.nodes.new("CompositorNodeComposite")
    tree.links.new(layers.outputs["Image"], glare.inputs["Image"])
    tree.links.new(glare.outputs["Image"], composite.inputs["Image"])


def build_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1350
    scene.render.resolution_percentage = 100
    scene.render.fps = 30
    scene.frame_start = 1
    scene.frame_end = 240
    scene.render.image_settings.file_format = "FFMPEG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.ffmpeg.format = "MPEG4"
    scene.render.ffmpeg.codec = "H264"
    scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
    scene.render.ffmpeg.ffmpeg_preset = "GOOD"
    scene.render.ffmpeg.audio_codec = "NONE"
    scene.render.filepath = VIDEO_PATH
    scene.world.color = (0.0, 0.0, 0.0)
    if hasattr(scene.render, "use_motion_blur"):
        scene.render.use_motion_blur = True
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.0
    scene.view_settings.gamma = 1.0

    create_background()
    create_camera()
    create_products()
    sparkle_material = create_motion_typography()
    create_energy_streak(
        "Energy_Product_Right",
        [(3.72, -4.55, 0.11), (3.40, -2.2, 0.11), (3.92, 0.35, 0.11), (3.45, 4.55, 0.11)],
        sparkle_material,
        12,
        78,
        depth=0.025,
    )
    create_energy_streak(
        "Energy_Product_Diagonal",
        [(-0.2, -4.25, 0.10), (1.4, -2.7, 0.10), (2.6, -0.2, 0.10), (3.8, 2.25, 0.10)],
        sparkle_material,
        48,
        118,
        depth=0.015,
    )
    create_sparks(sparkle_material)
    configure_compositor()

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)


def main():
    build_scene()
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    if "--render" in argv:
        bpy.ops.render.render(animation=True)
    else:
        scene = bpy.context.scene
        scene.frame_set(165)
        scene.render.image_settings.file_format = "PNG"
        scene.render.filepath = PREVIEW_PATH
        bpy.ops.render.render(write_still=True)
        scene.render.image_settings.file_format = "FFMPEG"
        scene.render.filepath = VIDEO_PATH
        bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)


if __name__ == "__main__":
    main()
