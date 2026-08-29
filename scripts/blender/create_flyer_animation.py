import math
import os
import random
import sys

import bpy
from mathutils import Vector


PROJECT_ROOT = r"E:\REMBERT REPUESTOS WEB\rembert-repuestos-web"
POSTER_PATH = os.path.join(
    PROJECT_ROOT,
    "public",
    "banners",
    "rembert-poster-epico-alta-calidad-v4.jpg",
)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "animations")
BLEND_PATH = os.path.join(OUTPUT_DIR, "rembert-poster-epico-animation.blend")
PREVIEW_PATH = os.path.join(OUTPUT_DIR, "rembert-poster-epico-animation-preview.png")
VIDEO_PATH = os.path.join(OUTPUT_DIR, "rembert-poster-epico-animation.mp4")


def set_linear_keyframes(target):
    if not target.animation_data or not target.animation_data.action:
        return
    for fcurve in target.animation_data.action.fcurves:
        for point in fcurve.keyframe_points:
            point.interpolation = "BEZIER"
            point.handle_left_type = "AUTO_CLAMPED"
            point.handle_right_type = "AUTO_CLAMPED"


def emissive_material(name, color, strength=4.0):
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


def create_poster_plane():
    bpy.ops.mesh.primitive_plane_add(size=2, location=(0.0, 0.0, 0.0))
    poster = bpy.context.object
    poster.name = "REMBERT_Poster"
    poster.scale = (4.0, 5.0, 1.0)

    material = bpy.data.materials.new(name="Poster_Emission")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    emission = nodes.new("ShaderNodeEmission")
    image_node = nodes.new("ShaderNodeTexImage")
    image_node.image = bpy.data.images.load(POSTER_PATH, check_existing=True)
    image_node.interpolation = "Linear"
    emission.inputs["Strength"].default_value = 1.0
    material.node_tree.links.new(image_node.outputs["Color"], emission.inputs["Color"])
    material.node_tree.links.new(emission.outputs["Emission"], output.inputs["Surface"])
    poster.data.materials.append(material)

    poster.scale = (4.08, 5.10, 1.0)
    poster.rotation_euler[2] = math.radians(-0.8)
    poster.keyframe_insert(data_path="scale", frame=1)
    poster.keyframe_insert(data_path="rotation_euler", frame=1)
    poster.scale = (4.0, 5.0, 1.0)
    poster.rotation_euler[2] = 0.0
    poster.keyframe_insert(data_path="scale", frame=38)
    poster.keyframe_insert(data_path="rotation_euler", frame=38)
    poster.scale = (4.03, 5.04, 1.0)
    poster.rotation_euler[2] = math.radians(0.22)
    poster.keyframe_insert(data_path="scale", frame=210)
    poster.keyframe_insert(data_path="rotation_euler", frame=210)
    set_linear_keyframes(poster)
    return poster


def create_camera():
    bpy.ops.object.camera_add(location=(0.0, 0.0, 10.0))
    camera = bpy.context.object
    camera.name = "REMBERT_Camera"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 10.85
    camera.data.lens = 50
    bpy.context.scene.camera = camera

    camera.location = (-0.12, 0.12, 10.0)
    camera.data.ortho_scale = 10.85
    camera.keyframe_insert(data_path="location", frame=1)
    camera.data.keyframe_insert(data_path="ortho_scale", frame=1)

    camera.location = (0.02, 0.02, 10.0)
    camera.data.ortho_scale = 10.08
    camera.keyframe_insert(data_path="location", frame=38)
    camera.data.keyframe_insert(data_path="ortho_scale", frame=38)

    camera.location = (-0.04, -0.02, 10.0)
    camera.data.ortho_scale = 9.98
    camera.keyframe_insert(data_path="location", frame=125)
    camera.data.keyframe_insert(data_path="ortho_scale", frame=125)

    camera.location = (0.06, -0.08, 10.0)
    camera.data.ortho_scale = 9.88
    camera.keyframe_insert(data_path="location", frame=210)
    camera.data.keyframe_insert(data_path="ortho_scale", frame=210)
    set_linear_keyframes(camera)
    set_linear_keyframes(camera.data)
    return camera


def create_energy_streak(name, points, start_frame, end_frame, material, depth=0.025):
    curve_data = bpy.data.curves.new(name=f"{name}_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 8
    curve_data.bevel_depth = depth
    curve_data.bevel_resolution = 4
    curve_data.bevel_factor_mapping_start = "SPLINE"
    curve_data.bevel_factor_mapping_end = "SPLINE"

    spline = curve_data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for index, point in enumerate(points):
        bezier_point = spline.bezier_points[index]
        bezier_point.co = point
        bezier_point.handle_left_type = "AUTO"
        bezier_point.handle_right_type = "AUTO"

    curve = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(curve)
    curve.data.materials.append(material)
    curve_data.bevel_factor_end = 0.0
    curve_data.keyframe_insert(data_path="bevel_factor_end", frame=start_frame)
    curve_data.bevel_factor_end = 1.0
    curve_data.keyframe_insert(data_path="bevel_factor_end", frame=end_frame)
    curve_data.bevel_factor_start = 0.0
    curve_data.keyframe_insert(data_path="bevel_factor_start", frame=end_frame - 6)
    curve_data.bevel_factor_start = 0.82
    curve_data.keyframe_insert(data_path="bevel_factor_start", frame=end_frame + 44)
    set_linear_keyframes(curve_data)
    return curve


def create_sparks(material):
    random.seed(38)
    for index in range(22):
        bpy.ops.mesh.primitive_ico_sphere_add(
            subdivisions=1,
            radius=random.uniform(0.015, 0.04),
            location=(
                random.uniform(-4.15, 4.15),
                random.uniform(-4.7, 3.2),
                random.uniform(0.16, 0.34),
            ),
        )
        spark = bpy.context.object
        spark.name = f"Spark_{index:02d}"
        spark.data.materials.append(material)
        start = 10 + index * 6
        duration = random.randint(38, 64)
        base_location = spark.location.copy()
        spark.scale = (0.0, 0.0, 0.0)
        spark.keyframe_insert(data_path="scale", frame=start)
        spark.keyframe_insert(data_path="location", frame=start)
        spark.scale = (1.0, 1.0, 1.0)
        spark.location = base_location + Vector((random.uniform(-0.18, 0.18), 0.35, 0.0))
        spark.keyframe_insert(data_path="scale", frame=start + 8)
        spark.keyframe_insert(data_path="location", frame=start + 8)
        spark.location = base_location + Vector((random.uniform(-0.45, 0.45), random.uniform(1.0, 1.8), 0.0))
        spark.scale = (0.0, 0.0, 0.0)
        spark.keyframe_insert(data_path="location", frame=start + duration)
        spark.keyframe_insert(data_path="scale", frame=start + duration)
        set_linear_keyframes(spark)


def configure_compositor():
    scene = bpy.context.scene
    scene.use_nodes = True
    tree = scene.node_tree
    tree.nodes.clear()
    render_layers = tree.nodes.new("CompositorNodeRLayers")
    glare = tree.nodes.new("CompositorNodeGlare")
    glare.glare_type = "FOG_GLOW"
    glare.quality = "HIGH"
    glare.threshold = 0.75
    glare.size = 7
    composite = tree.nodes.new("CompositorNodeComposite")
    tree.links.new(render_layers.outputs["Image"], glare.inputs["Image"])
    tree.links.new(glare.outputs["Image"], composite.inputs["Image"])


def build_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.curves, bpy.data.meshes, bpy.data.materials, bpy.data.cameras):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1350
    scene.render.resolution_percentage = 100
    scene.render.fps = 30
    scene.frame_start = 1
    scene.frame_end = 210
    scene.render.image_settings.file_format = "FFMPEG"
    scene.render.ffmpeg.format = "MPEG4"
    scene.render.ffmpeg.codec = "H264"
    scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
    scene.render.ffmpeg.ffmpeg_preset = "GOOD"
    scene.render.ffmpeg.audio_codec = "NONE"
    scene.render.filepath = VIDEO_PATH
    scene.render.film_transparent = False
    scene.render.image_settings.color_mode = "RGB"
    scene.render.resolution_percentage = 100
    scene.world.color = (0.0, 0.0, 0.0)

    try:
        scene.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        pass

    create_poster_plane()
    create_camera()

    gold = emissive_material("REMBERT_Gold", (1.0, 0.48, 0.015), strength=11.0)
    hot_gold = emissive_material("REMBERT_HotGold", (1.0, 0.80, 0.12), strength=18.0)

    create_energy_streak(
        "Energy_Right_01",
        [(3.95, -4.35, 0.24), (3.55, -2.2, 0.24), (3.95, 0.7, 0.24), (4.18, 4.45, 0.24)],
        8,
        72,
        hot_gold,
        depth=0.026,
    )
    create_energy_streak(
        "Energy_Left_01",
        [(-4.10, -3.65, 0.23), (-3.75, -2.5, 0.23), (-3.95, -1.35, 0.23), (-3.55, 0.1, 0.23)],
        35,
        96,
        gold,
        depth=0.018,
    )
    create_energy_streak(
        "Energy_Bottom_01",
        [(-3.95, -4.40, 0.26), (-1.7, -4.57, 0.26), (0.7, -4.40, 0.26), (3.95, -4.52, 0.26)],
        96,
        152,
        hot_gold,
        depth=0.022,
    )
    create_sparks(gold)
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
        scene.frame_set(80)
        scene.render.image_settings.file_format = "PNG"
        scene.render.filepath = PREVIEW_PATH
        bpy.ops.render.render(write_still=True)
        scene.render.image_settings.file_format = "FFMPEG"
        scene.render.filepath = VIDEO_PATH
        bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)


if __name__ == "__main__":
    main()
